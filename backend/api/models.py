from django.db import models

import uuid

# Create your models here.


class Transaction(models.Model):
    class Category(models.TextChoices):
        FOOD = "food", "Alimentation"
        HOUSING = "housing", "Logement"
        TRANSPORT = "transport", "Transport"
        HEALTH = "health", "Santé"
        LEISURE = "leisure", "Loisirs"
        SALARY = "salary", "Salaire"
        SHOPPING = "shopping", "Shopping"
        OTHER = "other", "Autre"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.OTHER,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.text}: {self.amount}"


class CategoryBudget(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(max_length=20, choices=Transaction.Category.choices)
    month = models.CharField(max_length=7)
    limit = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["category"]
        constraints = [
            models.UniqueConstraint(
                fields=["category", "month"],
                name="unique_category_month_budget",
            )
        ]

    def __str__(self):
        return f"{self.category} ({self.month}): {self.limit}"
