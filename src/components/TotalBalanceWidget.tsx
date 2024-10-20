import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'; 
import {
    Box,
    Text,
    useColorModeValue,
  } from "@chakra-ui/react";


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
  return (
    <Box
      p={4}
      borderRadius="lg"
      boxShadow="lg"
      bg={useColorModeValue('white', 'gray.700')}
    >
      <Text fontWeight="bold" fontSize="xl">Total Balance of All Products</Text>
      <Text fontSize="lg" mb={4}>123,456,789.00 Euro</Text>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx={200}
          cy={150}
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Box>
  );
};