import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button} from 'react-native';
import { Account, Expense } from './src/types';
import { calcSafeToSpend } from './src/utils/budget';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './src/screens/HomeScreen';


const Tab = createBottomTabNavigator()


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
    
      </Tab.Navigator>
    </NavigationContainer>
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



  // const [expenses,setExpenses] = useState<Expense[]>([]);

  // const handleChangeExpenses = () => {
    
  //   const newExpense: Expense = {
  //     id: Math.random().toString(),
  //     amount : Math.random(),
  //     name : 'random1',
  //     category: 'groceries'
  //   };

  //   setExpenses([...expenses,newExpense]);
  // }

  //  const totalSpent = 
  //  expenses.reduce( (sum, e) => sum + e.amount, 0 );
