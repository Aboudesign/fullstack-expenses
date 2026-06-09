from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def home(request):
    return JsonResponse(
        {
            "app": "Mes dépenses — API",
            "liens": {
                "admin": "/admin/",
                "transactions": "/api/transactions/",
                "budgets": "/api/budgets/",
            },
        }
    )


urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
]
