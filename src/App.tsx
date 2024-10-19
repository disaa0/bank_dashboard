import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Select,
  Flex,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

// Mock data for profiles and widgets
const profiles = [
  { id: 'base', name: 'Base Profile' },
  { id: 'risk', name: 'Risk Management' },
  { id: 'investment', name: 'Investment' },
];

const widgets = [
  { id: 'w1', name: 'Account Summary', profiles: ['base'] },
  { id: 'w2', name: 'Recent Transactions', profiles: ['base'] },
  { id: 'w3', name: 'Currency Tracker', profiles: ['risk'] },
  { id: 'w4', name: 'Stock Market', profiles: ['risk', 'investment'] },
  { id: 'w5', name: 'Investment Portfolio', profiles: ['investment'] },
];

const Widget = ({ name }: { name: string }) => (
  <Box
    bg="white"
    p={4}
    borderRadius="md"
    boxShadow="md"
    minHeight="150px"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    {name}
  </Box>
);

export const App = () => {
  const [selectedProfiles, setSelectedProfiles] = useState(['base']);

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
      <Box minH="100vh" p={3}>
        <Flex justifyContent="space-between" mb={4}>
          <Select
            placeholder="Select profiles"
            multiple
            value={selectedProfiles}
            onChange={handleProfileChange}
            maxWidth="300px"
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </Select>
          <ColorModeSwitcher />
        </Flex>
        <Grid
          templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
          gap={4}
          autoRows="minmax(150px, auto)"
        >
          {visibleWidgets.map((widget) => (
            <Widget key={widget.id} name={widget.name} />
          ))}
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
