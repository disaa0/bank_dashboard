import React, { useState, useEffect, useCallback } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
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
  useMediaQuery,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { FiDollarSign, FiTrendingUp, FiGlobe, FiPieChart, FiActivity, FiSettings, FiMove } from "react-icons/fi";
import { IconType } from 'react-icons';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import debounce from 'lodash/debounce';

import {
  TopicsWidget,
  AccountSummaryWidget,
} from './components';
import RecentTransactionsWidget from './components/RecentTransactionsWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

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
  content: React.ReactNode;
  minW: number;
  minH: number;
  maxW: number;
  maxH: number;
};

const profiles: Profile[] = [
  { id: 'base', name: 'Base Profile', fixed: true },
  { id: 'investment', name: 'Investment' },
];

const widgets: Widget[] = [
  {
    id: 'w1',
    name: 'Account Summary',
    profiles: ['base'],
    size: 'v_xxl',
    icon: FiDollarSign,
    content: <AccountSummaryWidget />,
    minW: 3,
    minH: 8,
    maxW: 4,
    maxH: 8
  },
  {
    id: 'w2',
    name: 'Recent Transactions',
    profiles: ['base'],
    size: 'large',
    icon: FiActivity,
    content: <RecentTransactionsWidget />,
    minW: 3,
    minH: 3,
    maxW: 6,
    maxH: 6
  },
  {
    id: 'w3',
    name: 'Currency Tracker',
    profiles: ['investment'],
    size: 'medium',
    icon: FiGlobe,
    content: <Text>Currency Tracker Content</Text>,
    minW: 3,
    minH: 3,
    maxW: 4,
    maxH: 4
  },
  {
    id: 'w4',
    name: 'Stock Market',
    profiles: ['investment'],
    size: 'medium',
    icon: FiTrendingUp,
    content: <Text>Stock Market Content</Text>,
    minW: 3,
    minH: 3,
    maxW: 4,
    maxH: 4
  },
  {
    id: 'w5',
    name: 'Topics',
    profiles: ['investment'],
    size: 'large',
    icon: FiTrendingUp,
    content: <TopicsWidget />,
    minW: 3,
    minH: 3,
    maxW: 5,
    maxH: 5
  },
];

const widgetSizes: Record<WidgetSize, { w: number; h: number }> = {
  small: { w: 1, h: 1 },
  medium: { w: 2, h: 2 },
  large: { w: 4, h: 4 },
  v_medium: { w: 2, h: 3 },
  v_large: { w: 2, h: 4 },
  v_xl: { w: 2, h: 5 },
  v_xxl: { w: 2, h: 6 },
};

type WidgetProps = {
  widget: Widget;
  isMoving: boolean;
};

const Widget: React.FC<WidgetProps> = ({ widget, isMoving }) => {
  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      boxShadow="lg"
      display="flex"
      flexDirection="column"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
      position="relative"
      height="100%"
    >
      {isMoving && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.1)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1}
        >
          <Icon as={FiMove} boxSize={8} color="gray.500" />
        </Box>
      )}
      <HStack mb={4}>
        <Icon as={widget.icon} boxSize={6} />
        <Text fontWeight="bold">{widget.name}</Text>
      </HStack>
      <Box flexGrow={1}>{widget.content}</Box>
    </Box>
  );
};

export const App: React.FC = () => {
  const [activeProfiles, setActiveProfiles] = useState<string[]>(['base']);
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [isMobile] = useMediaQuery("(max-width: 767px)");
  const getDefaultWidgetLayout = (widget: Widget, index: number): LayoutItem => {
    const size = widgetSizes[widget.size];
    return {
      i: widget.id,
      x: (index * 2) % 12,
      y: Math.floor((index * 2) / 12) * size.h,
      w: size.w,
      h: size.h,
      minW: widget.minW,
      minH: widget.minH,
      maxW: widget.maxW,
      maxH: widget.maxH,
    };
  };

  const findWidgetInLayout = (widgetId: string, currentLayout: LayoutItem[]): LayoutItem | undefined => {
    return currentLayout.find(item => item.i === widgetId);
  };

  const saveProfiles = (profiles: string[]) => {
    localStorage.setItem('activeProfiles', JSON.stringify(profiles));
  };


  const handleProfileToggle = (profileId: string) => {
    if (profileId === 'base') return;

    setActiveProfiles(prev => {
      const newProfiles = prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId];

      setActiveWidgets(currentActiveWidgets => {
        const profileWidgets = getWidgetsByProfile(profileId);
        let newActiveWidgets: string[];

        if (newProfiles.includes(profileId)) {
          // Profile is being enabled
          newActiveWidgets = Array.from(new Set([...currentActiveWidgets, ...profileWidgets.map(w => w.id)]));
        } else {
          // Profile is being disabled
          newActiveWidgets = currentActiveWidgets.filter(widgetId =>
            !profileWidgets.some(w => w.id === widgetId) ||
            widgets.find(w => w.id === widgetId)?.profiles.some(p => newProfiles.includes(p))
          );
        }

        setLayout(currentLayout => {
          let newLayout = currentLayout.filter(item => newActiveWidgets.includes(item.i));

          if (newProfiles.includes(profileId)) {
            // Add widgets for the newly enabled profile
            profileWidgets.forEach(widget => {
              if (newActiveWidgets.includes(widget.id)) {
                const newItem = addWidgetToLayout(widget, newLayout, newActiveWidgets);
                if (!newLayout.some(item => item.i === newItem.i)) {
                  newLayout.push(newItem);
                }
              }
            });
          }

          return newLayout;
        });

        return newActiveWidgets;
      });

      saveProfiles(newProfiles);
      return newProfiles;
    });
  };


  const handleWidgetToggle = (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget && !widget.profiles.includes('base')) {
      setActiveWidgets(prev => {
        const isActive = prev.includes(widgetId);
        const newActiveWidgets = isActive
          ? prev.filter(id => id !== widgetId)
          : [...prev, widgetId];

        setLayout(currentLayout => {
          if (isActive) {
            return currentLayout.filter(item => item.i !== widgetId);
          } else {
            const existingLayoutItem = findWidgetInLayout(widgetId, currentLayout);
            if (existingLayoutItem) {
              return currentLayout;
            } else {
              const newLayoutItem = getDefaultWidgetLayout(widget, newActiveWidgets.length - 1);
              return [...currentLayout, newLayoutItem];
            }
          }
        });

        return newActiveWidgets;
      });
    }
  };

  const getWidgetsByProfile = (profileId: string): Widget[] => {
    return widgets.filter(widget => widget.profiles.includes(profileId));
  };

  const addWidgetToLayout = (
    widget: Widget,
    currentLayout: LayoutItem[],
    activeWidgets: string[]
  ): LayoutItem => {
    const existingItem = currentLayout.find(item => item.i === widget.id);
    if (existingItem) {
      return existingItem;
    }

    const size = widgetSizes[widget.size];
    const newItem: LayoutItem = {
      i: widget.id,
      x: 0,
      y: Infinity,
      w: Math.max(size.w, widget.minW),
      h: Math.max(size.h, widget.minH),
      minW: widget.minW,
      minH: widget.minH,
      maxW: widget.maxW,
      maxH: widget.maxH,
    };

    // Find a suitable position for the new widget
    let placed = false;
    for (let x = 0; x <= 12 - newItem.w && !placed; x++) {
      newItem.x = x;
      if (!currentLayout.some(item =>
        item.x < newItem.x + newItem.w &&
        item.x + item.w > newItem.x &&
        item.y < newItem.y + newItem.h &&
        item.y + item.h > newItem.y
      )) {
        placed = true;
      }
    }

    return newItem;
  };

  const visibleWidgets = widgets.filter(widget =>
    activeWidgets.includes(widget.id) &&
    widget.profiles.some(profile => activeProfiles.includes(profile))
  );

  useEffect(() => {
    const savedProfiles = localStorage.getItem('activeProfiles');
    const initialProfiles = savedProfiles ? JSON.parse(savedProfiles) : ['base'];
    setActiveProfiles(initialProfiles);

    const initialWidgets = widgets.filter(widget =>
      widget.profiles.some(profile => initialProfiles.includes(profile))
    ).map(w => w.id);
    setActiveWidgets(initialWidgets);

    const saved = localStorage.getItem('dashboardLayout');
    let newLayout: LayoutItem[] = [];

    if (saved) {
      const savedLayout: LayoutItem[] = JSON.parse(saved);
      newLayout = savedLayout.filter(item => initialWidgets.includes(item.i));
    }

    // Ensure all active widgets are in the layout
    initialWidgets.forEach(widgetId => {
      const widget = widgets.find(w => w.id === widgetId)!;
      const newItem = addWidgetToLayout(widget, newLayout, initialWidgets);
      if (!newLayout.some(item => item.i === newItem.i)) {
        newLayout.push(newItem);
      }
    });

    setLayout(newLayout);
  }, []);


  const handleLayoutChange = useCallback((newLayout: LayoutItem[]) => {
    setLayout(newLayout);
    // localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
  }, []);

  const resetToDefaultLayout = () => {
    const newLayout = visibleWidgets.map((widget, index) => {
      const size = widgetSizes[widget.size];
      return {
        i: widget.id,
        x: (index * 2) % 12,
        y: Math.floor((index * 2) / 12) * size.h,
        w: size.w,
        h: size.h,
        minW: widget.minW,
        minH: widget.minH,
        maxW: widget.maxW,
        maxH: widget.maxH,
      };
    });
    setLayout(newLayout);
    localStorage.removeItem('dashboardLayout'); // Clear saved layout
  };

  return (
    <ChakraProvider>
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
                    <Box mt={4}>
                      <Text fontWeight="bold" mb={2}>Visible Widgets</Text>
                      {profiles.filter(profile => profile.id !== 'base' && activeProfiles.includes(profile.id)).map(profile => (
                        <Box key={profile.id} mb={4}>
                          <Text fontWeight="semibold" mb={2}>{profile.name}</Text>
                          {widgets
                            .filter(widget =>
                              widget.profiles.includes(profile.id) &&
                              !widget.profiles.includes('base')
                            )
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
                    <Button
                      onClick={() => {
                        setIsMoving(!isMoving)
                        localStorage.setItem('dashboardLayout', JSON.stringify(layout));
                      }}
                      leftIcon={<FiMove />}
                    >
                      {isMoving ? 'Lock Widgets' : 'Move Widgets'}
                    </Button>
                    <Button onClick={resetToDefaultLayout}>Reset Layout</Button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <ColorModeSwitcher />
            </HStack>
          </HStack>
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={100}
            width={1200}
            onLayoutChange={handleLayoutChange}
            preventCollision={!isLargerThan768}
            compactType="vertical"
            isResizable={isMoving && !isMobile}
            isDraggable={isMoving && !isMobile}
          >
            {visibleWidgets.map((widget) => (
              <Box key={widget.id}>
                <Widget widget={widget} isMoving={isMoving} />
              </Box>
            ))}
          </ResponsiveGridLayout>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};
