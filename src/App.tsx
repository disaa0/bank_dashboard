import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  GridItem,
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
  Link,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { FiMail, FiDollarSign, FiTrendingUp, FiGlobe, FiPieChart, FiActivity, FiSettings } from "react-icons/fi";
import { IconType } from 'react-icons';
import { Image } from "@chakra-ui/react";

type Profile = {
  id: string;
  name: string;
  fixed?: boolean;
};

type WidgetSize = 'small' | 'medium' | 'large' | 'v_medium' | 'v_large' | 'v_xl' | 'v_xxl';

type Widget = {
  id: string;
  name: string;
  profiles: string[];
  size: WidgetSize;
  icon: IconType;
};

const profiles: Profile[] = [
  { id: 'base', name: 'Base Profile', fixed: true },
  { id: 'risk', name: 'Risk Management' },
  { id: 'investment', name: 'Investment' },
];

const widgets: Widget[] = [
  { id: 'w1', name: 'Account Summary', profiles: ['base'], size: 'v_xxl', icon: FiDollarSign },
  { id: 'w2', name: 'Recent Transactions', profiles: ['base'], size: 'large', icon: FiActivity },
  { id: 'w3', name: 'Currency Tracker', profiles: ['risk'], size: 'small', icon: FiGlobe },
  { id: 'w4', name: 'Stock Market', profiles: ['risk', 'investment'], size: 'medium', icon: FiTrendingUp },
  { id: 'w5', name: 'Investment Portfolio', profiles: ['investment'], size: 'medium', icon: FiPieChart },
];

const widgetSizes: Record<WidgetSize, { rowSpan: number; colSpan: number }> = {
  small: { rowSpan: 1, colSpan: 1 },
  medium: { rowSpan: 1, colSpan: 2 },
  large: { rowSpan: 5, colSpan: 4 },
  v_medium: { rowSpan: 2, colSpan: 2 },
  v_large: { rowSpan: 3, colSpan: 2 },
  v_xl: { rowSpan: 4, colSpan: 2 },
  v_xxl: { rowSpan: 5, colSpan: 2 },
};

const baseProfileLayout = [
  { id: 'w1', colSpan: 2, rowSpan: 3 },
  { id: 'w2', colSpan: 3, rowSpan: 3 },
];

type WidgetProps = {
  name: string;
  size: WidgetSize;
  icon: IconType;
  rowSpan: number;
  colSpan: number;
};

const Widget: React.FC<WidgetProps> = ({ name, size, icon: IconComponent, rowSpan, colSpan }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
{/* Account Summary*/}
if (name === 'Account Summary') {
  const recentLinks = [
    { id: 1, label: 'Help', url: '/help' },
    { id: 2, label: 'About Us', url: '/about' },
    { id: 3, label: 'Contact Support', url: '/contact' },
  ];
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
      justifyContent="space-between"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
    >
  
      <HStack
        spacing={4}
        alignItems="center"
        bgGradient="linear(to-r, blue.500, blue.300)"
        p={4} 
        borderRadius="lg"
        boxShadow="md"
        mb={3} 
      >
        <Box position="relative">
          <Image
            src="profile.jpg"
            alt="Profile Picture"
            borderRadius="full"
            boxSize="70px" 
            border="3px solid white"
            />
        </Box>
        <VStack align="start" spacing={0.5}>
          <Text fontWeight="bold" fontSize="xl" color="white">
            John Doe
          </Text>
          <Text fontSize="sm" color="whiteAlpha.800">
            Senior Financial Analyst
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

     
      <VStack spacing={2} align="stretch" mb={2}>
       
        <Box position="relative" w="100%">
          <Button leftIcon={<Icon as={FiMail} />} w="100%" p={3} fontSize="sm">Email</Button>
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
          <Button leftIcon={<Icon as={FiGlobe} />} w="100%" p={3} fontSize="sm">GPP</Button>
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
          <Button leftIcon={<Icon as={FiTrendingUp} />} w="100%" p={3} fontSize="sm">Overview</Button>
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

  
      <Box mt={2}>
      <Text fontWeight="bold">Quick Access</Text>
      <VStack spacing={1} mt={1} align="start"> 
        {recentLinks.map(link => (
          <Text key={link.id} fontSize="sm">
            <Link color="blue.500" href={link.url} isExternal>
              {link.label}
            </Link>
          </Text>
        ))}
      </VStack>
    </Box>
    </Box>
  );
}


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
    if (profileId === 'base') return; // Prevent toggling the base profile
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

  // Ensure the base profile is always active
  useEffect(() => {
    if (!activeProfiles.includes('base')) {
      setActiveProfiles(prev => ['base', ...prev]);
    }
  }, [activeProfiles]);
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
                            isDisabled={profile.fixed}
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
            templateColumns="repeat(9, 1fr)"
            gap={6}
            autoRows="minmax(120px, auto)"
          >
            {visibleWidgets.map((widget) => {
              const baseLayout = baseProfileLayout.find(item => item.id === widget.id);
              const { rowSpan, colSpan } = baseLayout || widgetSizes[widget.size];
              return (
                <Widget
                  key={widget.id}
                  name={widget.name}
                  size={widget.size}
                  icon={widget.icon}
                  rowSpan={rowSpan}
                  colSpan={colSpan}
                />
              );
            })}
          </Grid>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};
