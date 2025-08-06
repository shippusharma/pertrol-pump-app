import { Briefcase, Car, DollarSign, Gift, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';

interface Transaction {
  id: string;
  timestamp: Date;
  amount: number;
  type: 'income' | 'expense';
  category: 'cash' | 'upi';
  description: string;
  icon: string;
}

export default function TransactionsScreen() {
  const [activeTab, setActiveTab] = useState<'cash' | 'upi'>('cash');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      amount: 50,
      type: 'expense',
      category: 'cash',
      description: 'Office Supplies',
      icon: 'briefcase',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      amount: 200,
      type: 'income',
      category: 'upi',
      description: 'Client Payment',
      icon: 'dollar-sign',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      amount: 75,
      type: 'expense',
      category: 'cash',
      description: 'Travel',
      icon: 'car',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      amount: 100,
      type: 'income',
      category: 'cash',
      description: 'Bonus',
      icon: 'gift',
    },
  ]);

  const filteredTransactions = transactions.filter(t => t.category === activeTab);

  const totalCash = transactions
    .filter(t => t.category === 'cash')
    .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

  const totalUPI = transactions
    .filter(t => t.category === 'upi')
    .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

  const handleSubmit = async () => {
    if (!amount.trim()) {
      Alert.alert('Validation Error', 'Please enter amount.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter description.');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount.');
      return;
    }

    try {
      setIsSubmitting(true);

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        timestamp: new Date(),
        amount: amountValue,
        type: transactionType,
        category: activeTab,
        description: description.trim(),
        icon: 'dollar-sign',
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Reset form
      setAmount('');
      setDescription('');

      Alert.alert('Success', 'Transaction added successfully!');
    } catch (error) {
      if (error instanceof Error) {
        return Alert.alert('Error', 'Failed to take photo. Please try again.');
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTransactionIcon = (iconName: string) => {
    switch (iconName) {
      case 'briefcase':
        return <Briefcase size={16} color="#FFFFFF" />;
      case 'gift':
        return <Gift size={16} color="#FFFFFF" />;
      case 'car':
        return <Car size={16} color="#FFFFFF" />;
      default:
        return <DollarSign size={16} color="#FFFFFF" />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <Text style={styles.subtitle}>Manage your financial records</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cash' && styles.activeTab]}
          onPress={() => setActiveTab('cash')}
        >
          <Text style={[styles.tabText, activeTab === 'cash' && styles.activeTabText]}>CASH</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upi' && styles.activeTab]}
          onPress={() => setActiveTab('upi')}
        >
          <Text style={[styles.tabText, activeTab === 'upi' && styles.activeTabText]}>UPI</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <Card style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>Total {activeTab.toUpperCase()}</Text>
          <Text style={styles.summaryAmount}>${activeTab === 'cash' ? totalCash : totalUPI}</Text>
        </View>
      </Card>

      {/* Add Transaction */}
      <Card style={styles.addCard}>
        <Text style={styles.sectionTitle}>Add Transaction</Text>

        <Input placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" variant="filled" />

        {/* Transaction Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, transactionType === 'income' && styles.typeButtonSelected]}
            onPress={() => setTransactionType('income')}
          >
            <TrendingUp size={16} color={transactionType === 'income' ? '#FFFFFF' : '#10B981'} />
            <Text style={[styles.typeButtonText, transactionType === 'income' && styles.typeButtonTextSelected]}>
              Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, transactionType === 'expense' && styles.typeButtonSelected]}
            onPress={() => setTransactionType('expense')}
          >
            <TrendingDown size={16} color={transactionType === 'expense' ? '#FFFFFF' : '#EF4444'} />
            <Text style={[styles.typeButtonText, transactionType === 'expense' && styles.typeButtonTextSelected]}>
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        <Input placeholder="Comment" value={description} onChangeText={setDescription} variant="filled" />

        <Button title="Add Transaction" onPress={handleSubmit} loading={isSubmitting} style={styles.addButton} />
      </Card>

      {/* Past Transactions */}
      <Card style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>Past Transactions</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>All ▼</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Income ▼</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Expense ▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {filteredTransactions.length === 0 ? (
          <Text style={styles.emptyText}>No transactions found</Text>
        ) : (
          filteredTransactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View
                style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.type === 'income' ? '#10B981' : '#EF4444' },
                ]}
              >
                {getTransactionIcon(transaction.icon)}
              </View>
              <View style={styles.transactionContent}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionType}>
                  {transaction.type} • {transaction.timestamp.toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={[styles.transactionAmount, { color: transaction.type === 'income' ? '#10B981' : '#EF4444' }]}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
              </Text>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  summaryCard: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  summaryContent: {
    backgroundColor: '#F1F5F9',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  addCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  typeButtonSelected: {
    backgroundColor: '#2563EB',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
  },
  addButton: {
    marginTop: 8,
  },
  historyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  historyHeader: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },
  filterText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  transactionType: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
