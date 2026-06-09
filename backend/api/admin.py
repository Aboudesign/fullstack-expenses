from django.contrib import admin
from .models import CategoryBudget, Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("text", "amount", "category", "created_at")
    list_filter = ("category",)
    search_fields = ("text",)
    ordering = ("-created_at",)


@admin.register(CategoryBudget)
class CategoryBudgetAdmin(admin.ModelAdmin):
    list_display = ("category", "month", "limit")
    list_filter = ("month", "category")
