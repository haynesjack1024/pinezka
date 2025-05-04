from django.contrib.auth import get_user_model
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import transaction
from django.db.models import Q
from rest_framework import serializers

from . import models


class AdditionalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AdditionalField
        fields = ["name", "value"]


class UserSerializer(serializers.ModelSerializer):
    additional_fields = AdditionalInfoSerializer(many=True)

    def create(self, validated_data):
        additional_fields = validated_data.pop("additional_fields", [])
        user = get_user_model().objects.create_user(**validated_data)
        models.AdditionalField.objects.bulk_create(
            [
                models.AdditionalField(user=user, **additional_field)
                for additional_field in additional_fields
            ]
        )
        return user

    @transaction.atomic()
    def update(self, instance, validated_data):
        additional_fields = validated_data.pop("additional_fields", [])
        try:
            new_password = validated_data.pop("password")
        except KeyError:
            new_password = None

        instance = super().update(instance, validated_data)

        if new_password is not None:
            instance.set_password(new_password)
            instance.save()

        for additional_field in additional_fields:
            models.AdditionalField.objects.update_or_create(
                user_id=instance.id,
                name=additional_field["name"],
                defaults={
                    "value": additional_field["value"],
                },
            )

        provided_field_names = [info["name"] for info in additional_fields]
        models.AdditionalField.objects.filter(
            ~Q(name__in=provided_field_names), user=instance
        ).delete()

        return instance

    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "password", "additional_fields"]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "max_length": 100,
            },
        }


class UserAuthenticationSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=150, validators=[UnicodeUsernameValidator]
    )
    password = serializers.CharField(max_length=100)
