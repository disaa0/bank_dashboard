import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Text, VStack, HStack, Box, Flex } from '@chakra-ui/react';

const data = [
  { name: 'Accounts', value: 5497356.12 },
  { name: 'Loans', value: 1724546.05 },
  { name: 'Guarantees', value: 497356.12 },
  { name: 'Investment Products', value: 7356.12 },
  { name: 'Other Accounts', value: 9564.12 },
  { name: 'Other Account', value: 4954.24 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F61', '#6A5ACD'];

const TotalBalanceWidget: React.FC = () => {
  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  const calculatePercentage = (value: number) => ((value / totalValue) * 100).toFixed(2);

  return (
    <Flex
      p={4}
      borderRadius="lg"
      boxShadow="lg"
      bg="transparent"
      wrap="wrap" // Это поможет адаптировать содержимое
    >
      <VStack align="start" spacing={4} flex="1">
        <Text fontWeight="bold" fontSize="xl" isTruncated maxWidth="100%">Total Balance of All Products</Text>
        <Text fontSize="lg" mb={4} isTruncated maxWidth="100%">123,456,789.00 Euro</Text>
        
        {/* График Pie Chart с пустотой внутри */}
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx={150}
            cy={150}
            innerRadius={50}
            outerRadius={80}
            labelLine={false}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </VStack>

      {/* Сайдбар с процентами и цветами */}
      <VStack align="start" spacing={3} pl={8} flex="1">
        {data.map((entry, index) => (
          <HStack key={index} spacing={2} maxWidth="100%">
            <Box width="12px" height="12px" bg={COLORS[index % COLORS.length]} borderRadius="full" />
            <Text fontWeight="medium" isTruncated maxWidth="120px">{entry.name}</Text>
            <Text color="gray.500" isTruncated maxWidth="80px">({calculatePercentage(entry.value)}%)</Text>
          </HStack>
        ))}
      </VStack>
    </Flex>
  );
};

export default TotalBalanceWidget;