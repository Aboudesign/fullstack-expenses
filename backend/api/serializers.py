from rest_framework import serializers
from .models import CategoryBudget, Transaction


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = ["id", "text", "amount", "category", "created_at"]
        read_only_fields = ["id", "created_at"]


class CategoryBudgetSerializer(serializers.ModelSerializer):

    class Meta:
        model = CategoryBudget
        fields = ["id", "category", "month", "limit"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        budget, _ = CategoryBudget.objects.update_or_create(
            category=validated_data["category"],
            month=validated_data["month"],
            defaults={"limit": validated_data["limit"]},
        )
        return budget
