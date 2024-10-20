import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Link,
  Tag,
  IconButton,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
  topics: string[];
}

// Mock API function to fetch news
const fetchNews = async (): Promise<NewsItem[]> => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    {
      id: '1',
      title: 'Federal Reserve Announces Interest Rate Decision',
      source: 'Financial Times',
      url: 'https://www.ft.com',
      date: '2024-10-20',
      topics: ['Monetary Policy', 'Economy'],
    },
    {
      id: '2',
      title: 'Tech Giant Reports Record Quarterly Earnings',
      source: 'Wall Street Journal',
      url: 'https://www.wsj.com',
      date: '2024-10-19',
      topics: ['Technology', 'Earnings'],
    },
    {
      id: '3',
      title: 'Global Markets React to Geopolitical Tensions',
      source: 'Bloomberg',
      url: 'https://www.bloomberg.com',
      date: '2024-10-18',
      topics: ['Global Markets', 'Geopolitics'],
    },
    {
      id: '4',
      title: 'New Regulations Proposed for Cryptocurrency Industry',
      source: 'Reuters',
      url: 'https://www.reuters.com',
      date: '2024-10-17',
      topics: ['Cryptocurrency', 'Regulation'],
    },
    {
      id: '5',
      title: 'Major Merger Announced in Banking Sector',
      source: 'CNBC',
      url: 'https://www.cnbc.com',
      date: '2024-10-16',
      topics: ['Banking', 'M&A'],
    },
  ];
};

const NewsWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [allTopics, setAllTopics] = useState<string[]>([]);

  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');
  const scrollbarBg = useColorModeValue('gray.100', 'gray.700');
  const scrollbarThumbBg = useColorModeValue('gray.300', 'gray.600');

  useEffect(() => {
    const loadNews = async () => {
      const fetchedNews = await fetchNews();
      setNews(fetchedNews);
      setFilteredNews(fetchedNews);

      const topics = Array.from(new Set(fetchedNews.flatMap(item => item.topics)));
      setAllTopics(topics);
    };

    loadNews();
  }, []);

  useEffect(() => {
    if (selectedTopics.length === 0) {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(item =>
        item.topics.some(topic => selectedTopics.includes(topic))
      ));
    }
  }, [selectedTopics, news]);

  const handleTopicChange = (topics: string[]) => {
    setSelectedTopics(topics);
  };

  return (
    <Box
      width="100%"
      height="100%"
      bg={bgColor}
      borderRadius="lg"
      boxShadow="md"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <HStack justifyContent="space-between" p={3} borderBottomWidth="1px">
        <Text fontSize="lg" fontWeight="bold">Latest News</Text>
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <IconButton
              aria-label="Filter news"
              icon={<FiFilter />}
              size="sm"
              variant="ghost"
            />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Text fontWeight="bold" mb={2}>Filter by Topics</Text>
              <CheckboxGroup colorScheme="blue" value={selectedTopics} onChange={handleTopicChange}>
                <VStack align="start">
                  {allTopics.map(topic => (
                    <Checkbox key={topic} value={topic}>
                      {topic}
                    </Checkbox>
                  ))}
                </VStack>
              </CheckboxGroup>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
      <VStack
        align="stretch"
        spacing={0}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: scrollbarBg,
          },
          '&::-webkit-scrollbar-thumb': {
            background: scrollbarThumbBg,
            borderRadius: '4px',
          },
        }}
      >
        {filteredNews.map((item) => (
          <Box
            key={item.id}
            p={3}
            _hover={{ bg: hoverBg }}
            transition="background-color 0.2s"
            borderBottomWidth="1px"
          >
            <Link href={item.url} isExternal>
              <Text fontWeight="medium" fontSize="sm" noOfLines={2}>
                {item.title}
              </Text>
            </Link>
            <HStack mt={1} justify="space-between" fontSize="xs">
              <Text color="gray.500">
                {item.source} • {item.date}
              </Text>
              <HStack spacing={1}>
                {item.topics.slice(0, 2).map(topic => (
                  <Tag key={topic} size="sm" variant="outline" colorScheme="blue">
                    {topic}
                  </Tag>
                ))}
                {item.topics.length > 2 && (
                  <Tag size="sm" variant="outline" colorScheme="gray">
                    +{item.topics.length - 2}
                  </Tag>
                )}
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default NewsWidget;
