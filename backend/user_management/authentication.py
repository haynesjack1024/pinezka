from rest_framework import exceptions
from rest_framework.authentication import SessionAuthentication


class CustomSessionAuthentication(SessionAuthentication):
    def authenticate(self, request):
        # Get the session-based user from the underlying HttpRequest object
        user = getattr(request._request, "user", None)

        # Unauthenticated, CSRF validation not required
        if not user or not user.is_active:
            raise exceptions.NotAuthenticated()

        self.enforce_csrf(request)

        # CSRF passed with authenticated user
        return user, None

    def authenticate_header(self, request):
        return "CookieSession"
