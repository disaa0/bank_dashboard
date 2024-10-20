import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  IconButton,
  Wrap,
  WrapItem,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { FiSearch, FiX, FiSettings } from "react-icons/fi";

interface TopicData {
  type: 'stock' | 'currency';
  name: string;
  value: string;
  change: string;
}

// Mock function to fetch topic data
const fetchTopicData = async (topic: string): Promise<TopicData> => {
  // In a real application, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return {
    type: Math.random() > 0.5 ? 'stock' : 'currency',
    name: topic,
    value: (Math.random() * 1000).toFixed(2),
    change: (Math.random() * 10 - 5).toFixed(2),
  };
};

interface TopicItemProps {
  topic: string;
  onRemove: (topic: string) => void;
}

const TopicItem: React.FC<TopicItemProps> = ({ topic, onRemove }) => {
  const [data, setData] = useState<TopicData | null>(null);
  const bgColor = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    fetchTopicData(topic).then(setData);
  }, [topic]);

  if (!data) return null;

  const changeColor = parseFloat(data.change) >= 0 ? 'green.500' : 'red.500';

  return (
    <WrapItem>
      <Box bg={bgColor} p={2} borderRadius="md">
        <HStack>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">{data.name}</Text>
            <Text fontSize="sm">{data.type === 'stock' ? 'Stock' : 'Currency'}</Text>
          </VStack>
          <VStack align="end" spacing={0}>
            <Text>{data.value}</Text>
            <Text color={changeColor} fontSize="sm">{data.change}%</Text>
          </VStack>
          <IconButton
            icon={<FiX />}
            size="sm"
            aria-label="Remove topic"
            onClick={() => onRemove(topic)}
          />
        </HStack>
      </Box>
    </WrapItem>
  );
};

const TopicsWidget: React.FC = () => {
  const [topics, setTopics] = useState<string[]>(['AAPL', 'GOOGL', 'USD/EUR']);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const addTopic = () => {
    if (searchTerm && !topics.includes(searchTerm)) {
      setTopics([...topics, searchTerm]);
      setSearchTerm('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setTopics(topics.filter(topic => topic !== topicToRemove));
  };

  return (
    <Box p={4}>
      <VStack align="stretch" spacing={4}>
        <HStack>
          <Input
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button leftIcon={<FiSearch />} onClick={addTopic}>
            Add
          </Button>
          <Popover>
            <PopoverTrigger>
              <IconButton icon={<FiSettings />} aria-label="Settings" />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Text>Widget Settings</Text>
                {/* Add settings options here */}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
        <Wrap spacing={2}>
          {topics.map(topic => (
            <TopicItem key={topic} topic={topic} onRemove={removeTopic} />
          ))}
        </Wrap>
      </VStack>
    </Box>
  );
};

export default TopicsWidget;
