from django.contrib import admin
from django.urls import path , include
from . import views

urlpatterns = [
    path("transactions/", views.TransactionListCreateView.as_view()),
    path(
        "transactions/<uuid:id>/",
        views.TransactionRetrieveUpdateDestroyView.as_view(),
    ),
    path("budgets/", views.CategoryBudgetListCreateView.as_view()),
    path(
        "budgets/<uuid:id>/",
        views.CategoryBudgetRetrieveUpdateDestroyView.as_view(),
    ),
]
