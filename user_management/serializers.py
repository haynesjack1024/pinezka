from django.contrib.auth import get_user_model
from django.contrib.auth.validators import UnicodeUsernameValidator
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        try:
            new_password = validated_data.pop("password")
        except KeyError:
            new_password = None

        super().update(instance, validated_data)

        if new_password is not None:
            instance.set_password(new_password)
            instance.save()

    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "password"]
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
