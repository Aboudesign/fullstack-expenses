import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_transaction_category"),
    ]

    operations = [
        migrations.CreateModel(
            name="CategoryBudget",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("food", "Alimentation"),
                            ("housing", "Logement"),
                            ("transport", "Transport"),
                            ("health", "Santé"),
                            ("leisure", "Loisirs"),
                            ("salary", "Salaire"),
                            ("shopping", "Shopping"),
                            ("other", "Autre"),
                        ],
                        max_length=20,
                    ),
                ),
                ("month", models.CharField(max_length=7)),
                ("limit", models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                "ordering": ["category"],
            },
        ),
        migrations.AddConstraint(
            model_name="categorybudget",
            constraint=models.UniqueConstraint(
                fields=("category", "month"),
                name="unique_category_month_budget",
            ),
        ),
    ]
