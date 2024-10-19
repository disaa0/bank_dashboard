import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Select,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { FiDollarSign, FiTrendingUp, FiGlobe, FiPieChart, FiActivity } from "react-icons/fi";
import { IconType } from 'react-icons';

type Profile = {
  id: string;
  name: string;
};

type WidgetSize = 'small' | 'medium' | 'large';

type Widget = {
  id: string;
  name: string;
  profiles: string[];
  size: WidgetSize;
  icon: IconType;
};

const profiles: Profile[] = [
  { id: 'base', name: 'Base Profile' },
  { id: 'risk', name: 'Risk Management' },
  { id: 'investment', name: 'Investment' },
];

const widgets: Widget[] = [
  { id: 'w1', name: 'Account Summary', profiles: ['base'], size: 'medium', icon: FiDollarSign },
  { id: 'w2', name: 'Recent Transactions', profiles: ['base'], size: 'large', icon: FiActivity },
  { id: 'w3', name: 'Currency Tracker', profiles: ['risk'], size: 'small', icon: FiGlobe },
  { id: 'w4', name: 'Stock Market', profiles: ['risk', 'investment'], size: 'medium', icon: FiTrendingUp },
  { id: 'w5', name: 'Investment Portfolio', profiles: ['investment'], size: 'large', icon: FiPieChart },
];

const widgetSizes: Record<WidgetSize, { rowSpan: number; colSpan: number }> = {
  small: { rowSpan: 1, colSpan: 1 },
  medium: { rowSpan: 1, colSpan: 2 },
  large: { rowSpan: 2, colSpan: 2 },
};

type WidgetProps = {
  name: string;
  size: WidgetSize;
  icon: IconType;
};

const Widget: React.FC<WidgetProps> = ({ name, size, icon: IconComponent }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const { rowSpan, colSpan } = widgetSizes[size];

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      boxShadow="lg"
      gridRow={`span ${rowSpan}`}
      gridColumn={`span ${colSpan}`}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
    >
      <Icon as={IconComponent} boxSize={8} mb={2} />
      <Text fontWeight="bold">{name}</Text>
    </Box>
  );
};

export const App: React.FC = () => {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>(['base']);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedProfiles(selectedOptions);
  };

  const visibleWidgets = widgets.filter((widget) =>
    widget.profiles.some((profile) => selectedProfiles.includes(profile))
  );

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg={bgColor} p={6}>
        <VStack spacing={6} align="stretch">
          <HStack justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="bold">Corporate Banking Dashboard</Text>
            <ColorModeSwitcher />
          </HStack>
          <Select
            placeholder="Select profiles"
            multiple
            value={selectedProfiles}
            onChange={handleProfileChange}
            maxWidth="300px"
            size="lg"
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </Select>
          <Grid
            templateColumns="repeat(6, 1fr)"
            gap={6}
            autoRows="minmax(120px, auto)"
          >
            {visibleWidgets.map((widget) => (
              <Widget key={widget.id} name={widget.name} size={widget.size} icon={widget.icon} />
            ))}
          </Grid>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};
