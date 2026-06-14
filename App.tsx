import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button} from 'react-native';
import { Account, Expense } from './src/types';
import { calcSafeToSpend } from './src/utils/budget';
import { useState } from 'react';


const AccountTest: Account = {
  id: '1',
  balance: 1200
};




export default function App() {


  const [expenses,setExpenses] = useState<Expense[]>([]);

  const handleChangeExpenses = () => {
    
    const newExpense: Expense = {
      id: Math.random().toString(),
      amount : Math.random(),
      name : 'random1',
      category: 'groceries'
    };

    setExpenses([...expenses,newExpense]);
  }

   const totalSpent = 
   expenses.reduce( (sum, e) => sum + e.amount, 0 );





  return (
    <View style={styles.container}>
      <Text>Helooo!</Text>

      <Button
      title='add Random Expense'
      onPress={() => handleChangeExpenses()}>
      </Button>

      <Text>Total Spent: ${totalSpent}</Text>
      
     
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
