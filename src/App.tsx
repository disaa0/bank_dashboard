import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Checkbox,
  Divider,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { FiDollarSign, FiTrendingUp, FiGlobe, FiPieChart, FiActivity, FiSettings } from "react-icons/fi";
import { IconType } from 'react-icons';

type Profile = {
  id: string;
  name: string;
  fixed?: boolean;
};

type WidgetSize = 'small' | 'medium' | 'large' | 'v_medium' | 'v_large';

type Widget = {
  id: string;
  name: string;
  profiles: string[];
  size: WidgetSize;
  icon: IconType;
};

const profiles: Profile[] = [
  { id: 'base', name: 'Base Profile', fixed: true},
  { id: 'risk', name: 'Risk Management' },
  { id: 'investment', name: 'Investment' },
];

const widgets: Widget[] = [
  { id: 'w1', name: 'Account Summary', profiles: ['base'], size: 'v_large', icon: FiDollarSign },
  { id: 'w2', name: 'Recent Transactions', profiles: ['base'], size: 'large', icon: FiActivity },
  { id: 'w3', name: 'Currency Tracker', profiles: ['risk'], size: 'small', icon: FiGlobe },
  { id: 'w4', name: 'Stock Market', profiles: ['risk', 'investment'], size: 'medium', icon: FiTrendingUp },
  { id: 'w5', name: 'Investment Portfolio', profiles: ['investment'], size: 'large', icon: FiPieChart },
];

// Define an explicit layout for the base profile
const baseProfileLayout = [
  { id: 'w1', colSpan: 4, rowSpan: 1 },
  { id: 'w2', colSpan: 5, rowSpan: 2 },
];

const widgetSizes: Record<WidgetSize, { rowSpan: number; colSpan: number }> = {
  small: { rowSpan: 1, colSpan: 1 },
  medium: { rowSpan: 1, colSpan: 2 },
  large: { rowSpan: 2, colSpan: 2 },
  v_medium: { rowSpan: 2, colSpan: 1 },
  v_large: { rowSpan: 3, colSpan: 1 },
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
  const [activeProfiles, setActiveProfiles] = useState<string[]>(['base']);
  const [activeWidgets, setActiveWidgets] = useState<string[]>(widgets.map(w => w.id));
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleProfileToggle = (profileId: string) => {
    setActiveProfiles(prev =>
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleWidgetToggle = (widgetId: string) => {
    setActiveWidgets(prev =>
      prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const visibleWidgets = widgets.filter(widget =>
    activeWidgets.includes(widget.id) &&
    widget.profiles.some(profile => activeProfiles.includes(profile))
  );

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg={bgColor} p={6}>
        <VStack spacing={6} align="stretch">
          <HStack justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="bold">Corporate Banking Dashboard</Text>
            <HStack>
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Button leftIcon={<FiSettings />}>Customize</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Dashboard Customization</PopoverHeader>
                  <PopoverBody>
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <Text fontWeight="bold" mb={2}>Active Profiles</Text>
                        {profiles.map(profile => (
                          <Checkbox
                            key={profile.id}
                            isChecked={activeProfiles.includes(profile.id)}
                            onChange={() => handleProfileToggle(profile.id)}
                          >
                            {profile.name}
                          </Checkbox>
                        ))}
                      </Box>
                      <Divider />
                      <Box>
                        <Text fontWeight="bold" mb={2}>Visible Widgets</Text>
                        {profiles.map(profile => (
                          <Box key={profile.id} mb={4}>
                            <Text fontWeight="semibold" mb={2}>{profile.name}</Text>
                            {widgets
                              .filter(widget => widget.profiles.includes(profile.id))
                              .map(widget => (
                                <Checkbox
                                  key={widget.id}
                                  isChecked={activeWidgets.includes(widget.id)}
                                  onChange={() => handleWidgetToggle(widget.id)}
                                  ml={4}
                                >
                                  {widget.name}
                                </Checkbox>
                              ))}
                          </Box>
                        ))}
                      </Box>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <ColorModeSwitcher />
            </HStack>
          </HStack>
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
