import { View, Text, FlatList } from 'react-native';
import { useAppStore } from '../store/appStore';


export default function HomeScreen() {

    const accounts = useAppStore((state) => state.accounts);
    const budgets = useAppStore((state) => state.budgets);
    const expenses = useAppStore((state) => state.expenses);


   return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Accounts: {accounts.length}</Text>
      <FlatList
        data={budgets}
        keyExtractor={(b) => b.id}
        renderItem={({ item }) => {
          const spent = expenses
            .filter((e) => e.budgetId === item.id)
            .reduce((sum, e) => sum + e.amount, 0);
          return (
            <Text>{item.name}: ${spent} / ${item.limit}</Text>
          );
        }}
      />
    </View>
   );


}

