import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,

  } from "@chakra-ui/react";

export const RecentTransactionsWidget: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false); // State to manage the toggle
  const transactions = [
    {
      id: 1,
      accountName: "Premium Business Account",
      accountNumber: "DE99 5004 0000 1122 3344 55",
      amount: 25000,
      type: 'Deposit',
      date: '2024-10-20',
    },
    {
      id: 2,
      accountName: "Savings Account",
      accountNumber: "DE22 5004 0000 1122 3344 56",
      amount: -200,
      type: 'Withdrawal',
      date: '2024-10-19',
    },
    {
      id: 3,
      accountName: "Investment Account",
      accountNumber: "DE33 5004 0000 1122 3344 57",
      amount: 150,
      type: 'Deposit',
      date: '2024-10-18',
    },
  ];

  return (
    <Box
      p={4}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"

    >
      <HStack justifyContent="space-between" mb={4}>
        <Text fontWeight="bold" fontSize="xl">Most Used Accounts</Text>
        <Button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
      </HStack>

      <VStack spacing={4} align="start">
        {transactions.map(transaction => (
          <Box key={transaction.id} borderWidth={1} borderRadius="lg" p={2} width="100%">
            {showDetails && (
              <>
                <Text fontWeight="bold">{transaction.accountName}</Text>
                <Text fontSize="sm" color="gray.500">
                  {transaction.accountNumber}
                </Text>
              </>
            )}
            <HStack spacing={2} marginTop={1}>
              <Text fontSize="md" color={transaction.amount > 0 ? 'green.500' : 'red.500'}>
                {transaction.type}: {transaction.amount > 0 ? '+' : ''}{transaction.amount} €
              </Text>
              <Text fontSize="sm" color="gray.500">({transaction.date})</Text>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
export default RecentTransactionsWidget;