from rest_framework import generics
from .models import CategoryBudget, Transaction
from .serializers import CategoryBudgetSerializer, TransactionSerializer


class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class TransactionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    lookup_field = "id"


class CategoryBudgetListCreateView(generics.ListCreateAPIView):
    serializer_class = CategoryBudgetSerializer

    def get_queryset(self):
        queryset = CategoryBudget.objects.all()
        month = self.request.query_params.get("month")
        if month:
            queryset = queryset.filter(month=month)
        return queryset


class CategoryBudgetRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CategoryBudget.objects.all()
    serializer_class = CategoryBudgetSerializer
    lookup_field = "id"
