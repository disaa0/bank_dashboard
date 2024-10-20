import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMail, FiGlobe, FiTrendingUp } from "react-icons/fi";
import KutzhanPhoto from './image/Kutzhan_Alisher_Photo.jpg'; 
interface RecentLink {
  id: number;
  label: string;
  url: string;
}

const recentLinks: RecentLink[] = [
  { id: 1, label: 'Help', url: '/help' },
  { id: 2, label: 'About Us', url: '/about' },
  { id: 3, label: 'Contact Support', url: '/contact' },
];

export const AccountSummaryWidget: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <VStack spacing={4} align="stretch" height="100%">
      {/* Profile Section */}
      <HStack
        spacing={4}
        alignItems="center"
        bgGradient="linear(to-r, blue.500, blue.300)"
        p={4}
        borderRadius="lg"
        boxShadow="md"
      >
        <Image
          src={KutzhanPhoto}
          alt="Profile Picture"
          borderRadius="full"
          boxSize="70px"
          border="3px solid white"
        />
        <VStack align="start" spacing={0.5}>
          <Text fontWeight="bold" fontSize="xl" color="white">
            Kutzhan Alisher
          </Text>
          <Text fontSize="sm" color="whiteAlpha.800">
            Company name
          </Text>
          <HStack spacing={2}>
            <Text color="white" fontSize="xs">
              Account: 123456789
            </Text>
            <Text color="white" fontSize="xs">
              Balance: $10,000
            </Text>
          </HStack>
        </VStack>
      </HStack>

      {/* Button Section */}
      <VStack spacing={2} align="stretch">
        <Box position="relative" w="100%">
          <Button leftIcon={<FiMail />} w="100%" p={3} fontSize="sm">Mail</Button>
          <Box
            position="absolute"
            top="-8px"
            right="-8px"
            bg="red.500"
            color="white"
            borderRadius="full"
            boxSize="20px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="xs"
          >
            3
          </Box>
        </Box>
        <Box position="relative" w="100%">
            <Button leftIcon={<FiGlobe />} w="100%" p={3} fontSize="sm">GPP</Button>
          <Box
            position="absolute"
            top="-8px"
            right="-8px"
            bg="red.500"
            color="white"
            borderRadius="full"
            boxSize="20px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="xs"
          >
            0
          </Box>
        </Box>
        <Box position="relative" w="100%">
        <Button leftIcon={<FiTrendingUp />} w="100%" p={3} fontSize="sm">Overview</Button>
          <Box
            position="absolute"
            top="-8px"
            right="-8px"
            bg="red.500"
            color="white"
            borderRadius="full"
            boxSize="20px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="xs"
          >
            0
          </Box>
        </Box>

       
        
      </VStack>

      {/* Quick Access Section */}
      <Box>
        <Text fontWeight="bold" mb={2}>Quick Access</Text>
        <VStack spacing={1} align="start">
          {recentLinks.map(link => (
            <Text key={link.id} fontSize="sm">
              <Link color="blue.500" href={link.url} isExternal>
                {link.label}
              </Link>
            </Text>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};

export default AccountSummaryWidget;