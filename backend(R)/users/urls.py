from django.urls import path
from .views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.utils import extend_schema

# Decorate JWT views with proper tags and descriptions
DecoratedTokenObtainPairView = extend_schema(
    tags=['Authentication'],
    summary='Login',
    description='Authenticate with username and password to obtain JWT access and refresh tokens'
)(TokenObtainPairView)

DecoratedTokenRefreshView = extend_schema(
    tags=['Authentication'],
    summary='Refresh Token',
    description='Refresh the access token using a valid refresh token'
)(TokenRefreshView)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', DecoratedTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', DecoratedTokenRefreshView.as_view(), name='token_refresh'),
]