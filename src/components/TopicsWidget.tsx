import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, VStack, HStack, Input, Button, Text, IconButton, Wrap, WrapItem,
  useColorModeValue, Popover, PopoverTrigger, PopoverContent, PopoverBody,
  PopoverArrow, PopoverCloseButton, Select, Checkbox, Divider,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  Table, Thead, Tbody, Tr, Th, Td, Accordion, AccordionItem, AccordionButton,
  AccordionPanel, AccordionIcon, Tooltip, useToast
} from "@chakra-ui/react";
import { FiSearch, FiX, FiSettings, FiInfo, FiPlus } from "react-icons/fi";
import debounce from 'lodash/debounce';

interface TopicData {
  type: 'stock' | 'currency' | 'commodity' | 'index';
  name: string;
  value: string;
  change: string;
  category: string;
  details?: {
    [key: string]: string;
  };
}

// Mock WebSocket for real-time updates
const mockWebSocket = {
  onmessage: null as ((event: { data: string }) => void) | null,
  send: (data: string) => {
    console.log('WebSocket message sent:', data);
  },
  close: () => {
    console.log('WebSocket closed');
  }
};

// Mock API function
const fetchTopicData = async (query: string): Promise<TopicData[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  const types = ['stock', 'currency', 'commodity', 'index'];
  return types.flatMap(type =>
    Array(3).fill(null).map(() => ({
      type: type as TopicData['type'],
      name: `${query}_${Math.random().toString(36).substring(3)}`,
      value: (Math.random() * 1000).toFixed(2),
      change: (Math.random() * 10 - 5).toFixed(2),
      category: type.charAt(0).toUpperCase() + type.slice(1),
      details: {
        'Market Cap': '$' + (Math.random() * 1000000000).toFixed(2),
        'Volume': (Math.random() * 1000000).toFixed(0),
        'P/E Ratio': (Math.random() * 30).toFixed(2),
      }
    }))
  );
};

interface TopicItemProps {
  topic: TopicData;
  onRemove: (topic: TopicData) => void;
  onShowDetails: (topic: TopicData) => void;
}


const TopicItem: React.FC<TopicItemProps> = ({ topic, onRemove, onShowDetails }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const changeColor = parseFloat(topic.change) >= 0 ? 'green.500' : 'red.500';

  return (
    <WrapItem>
      <Box bg={bgColor} p={2} borderRadius="md" width="200px" boxShadow="sm">
        <HStack justifyContent="space-between">
          <VStack align="start" spacing={0}>
            <Tooltip label={topic.name}>
              <Text fontWeight="bold" fontSize="sm" isTruncated maxWidth="100px">{topic.name}</Text>
            </Tooltip>
            <Text fontSize="xs" color="gray.500">{topic.type}</Text>
          </VStack>
          <VStack align="end" spacing={0}>
            <Text fontSize="sm" fontWeight="medium">{topic.value}</Text>
            <Text color={changeColor} fontSize="xs" fontWeight="bold">{topic.change}%</Text>
          </VStack>
          <HStack>
            <IconButton
              icon={<FiInfo />}
              size="xs"
              aria-label="Show details"
              onClick={() => onShowDetails(topic)}
              variant="ghost"
            />
            <IconButton
              icon={<FiX />}
              size="xs"
              aria-label="Remove topic"
              onClick={() => onRemove(topic)}
              variant="ghost"
            />
          </HStack>
        </HStack>
      </Box>
    </WrapItem>
  );
};

const LOCAL_STORAGE_KEY = 'topics';

const TopicsWidget: React.FC = () => {
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [searchResults, setSearchResults] = useState<TopicData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  const [sortOption, setSortOption] = useState<string>('name');
  const webSocketRef = useRef<WebSocket | null>(null);
  const toast = useToast();

  const loadTopicsFromLocalStorage = useCallback(() => {
    try {
      const savedTopics = localStorage.getItem(LOCAL_STORAGE_KEY);
      console.log('Raw saved topics:', savedTopics);
      if (savedTopics) {
        const parsedTopics = JSON.parse(savedTopics);
        console.log('Parsed topics:', parsedTopics);
        if (Array.isArray(parsedTopics)) {
          setTopics(parsedTopics);
          console.log('Topics loaded from local storage:', parsedTopics);
        } else {
          console.error('Saved topics is not an array:', parsedTopics);
          toast({
            title: "Error loading topics",
            description: "The saved topics data is invalid. Resetting to default.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setTopics([]);
        }
      } else {
        console.log('No topics found in local storage');
      }
    } catch (error) {
      console.error('Error loading topics from local storage:', error);
      toast({
        title: "Error loading topics",
        description: "There was an issue loading your saved topics. Please try refreshing the page.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    loadTopicsFromLocalStorage();

    // Initialize WebSocket connection
    webSocketRef.current = mockWebSocket as unknown as WebSocket;
    webSocketRef.current.onmessage = handleWebSocketMessage;

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [loadTopicsFromLocalStorage]);

  useEffect(() => {
    // Save topics to local storage whenever they change
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(topics));
      console.log('Topics saved to local storage:', topics);
    } catch (error) {
      console.error('Error saving topics to local storage:', error);
      toast({
        title: "Error saving topics",
        description: "There was an issue saving your topics. Some changes may not persist.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [topics, toast]);

  const handleWebSocketMessage = (event: { data: string }) => {
    const updatedTopic = JSON.parse(event.data) as TopicData;
    setTopics(prevTopics =>
      prevTopics.map(topic =>
        topic.name === updatedTopic.name ? { ...topic, ...updatedTopic } : topic
      )
    );
  };

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query) {
        const results = await fetchTopicData(query);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);


  const addTopic = (topic: TopicData) => {
    if (!topics.some(t => t.name === topic.name)) {
      setTopics(prevTopics => {
        const newTopics = [...prevTopics, topic];
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTopics));
          console.log('Topics saved after addition:', newTopics);
        } catch (error) {
          console.error('Error saving topics after addition:', error);
        }
        return newTopics;
      });
      if (webSocketRef.current) {
        webSocketRef.current.send(JSON.stringify({ action: 'subscribe', topic: topic.name }));
      }
      toast({
        title: "Topic added",
        description: `${topic.name} has been added to your watchlist.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeTopic = (topicToRemove: TopicData) => {
    setTopics(prevTopics => {
      const newTopics = prevTopics.filter(topic => topic.name !== topicToRemove.name);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTopics));
        console.log('Topics saved after removal:', newTopics);
      } catch (error) {
        console.error('Error saving topics after removal:', error);
      }
      return newTopics;
    });
    if (webSocketRef.current) {
      webSocketRef.current.send(JSON.stringify({ action: 'unsubscribe', topic: topicToRemove.name }));
    }
    toast({
      title: "Topic removed",
      description: `${topicToRemove.name} has been removed from your watchlist.`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const sortTopics = (topicsToSort: TopicData[]): TopicData[] => {
    return [...topicsToSort].sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'value':
          return parseFloat(b.value) - parseFloat(a.value);
        case 'change':
          return parseFloat(b.change) - parseFloat(a.change);
        default:
          return 0;
      }
    });
  };


  const groupedTopics = topics.reduce((acc, topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {} as { [key: string]: TopicData[] });

  return (
    <Box
      width="auto"
      height="100%"
      p={4}
      bg={useColorModeValue('gray.50', 'gray.800')}
      borderRadius="lg"
      boxShadow="md"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <VStack align="stretch" spacing={4} flex="0 0 auto">
        <HStack>
          <Input
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={useColorModeValue('white', 'gray.700')}
          />
          <Button
            onClick={() => setSortOption(sortOption === 'name' ? 'value' : 'name')}
            size="sm"
          >
            Sort: {sortOption === 'name' ? 'Name' : 'Value'}
          </Button>
        </HStack>
        {searchResults.length > 0 && (
          <Box>
            <Text fontWeight="bold" mb={2}>Search Results</Text>
            <Wrap spacing={2}>
              {searchResults.map(result => (
                <WrapItem key={result.name}>
                  <Button
                    size="sm"
                    onClick={() => addTopic(result)}
                    leftIcon={<FiPlus />}
                    colorScheme="blue"
                  >
                    {result.name}
                  </Button>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}
      </VStack>
      <Box flex="1 1 auto" overflow="auto" mt={4}>
        <Accordion allowMultiple defaultIndex={[0, 1, 2, 3]}>
          {Object.entries(groupedTopics).map(([category, categoryTopics]) => (
            <AccordionItem key={category}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    {category} ({categoryTopics.length})
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Wrap spacing={2}>
                  {sortTopics(categoryTopics).map(topic => (
                    <TopicItem
                      key={topic.name}
                      topic={topic}
                      onRemove={removeTopic}
                      onShowDetails={(topic) => setSelectedTopic(topic)}
                    />
                  ))}
                </Wrap>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
      <Modal isOpen={!!selectedTopic} onClose={() => setSelectedTopic(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedTopic?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Metric</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {selectedTopic?.details && Object.entries(selectedTopic.details).map(([key, value]) => (
                  <Tr key={key}>
                    <Td>{key}</Td>
                    <Td>{value}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button onClick={loadTopicsFromLocalStorage} size="sm" mt={2}>
        Reload Topics
      </Button>
    </Box >
  );
};
export default TopicsWidget;
