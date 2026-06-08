from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="transaction",
            name="category",
            field=models.CharField(
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
                default="other",
                max_length=20,
            ),
        ),
    ]
