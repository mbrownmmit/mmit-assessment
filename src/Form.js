import * as React from "react";
import {
  Container,
  VStack,
  Select,
  Checkbox,
  Input,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import {
  AsyncCreatableSelect,
  AsyncSelect,
  CreatableSelect,
  useChakraSelectProps,
  Select as MultiSelect,
} from "chakra-react-select";

import { fetchTypes, fetchMakes, fetchCarData } from "./fetch";

function App() {
  const [types, setTypes] = React.useState([]);
  const [selectedType, setSelectedType] = React.useState(null);

  const [makes, setMakes] = React.useState([]);
  const [selectedMakes, setSelectedMakes] = React.useState(null);

  const [carData, setCarData] = React.useState([]);

  const [year, setYear] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const newTypes = await fetchTypes();
      setTypes(newTypes);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const newMakes = await fetchMakes(selectedType);
      setMakes(newMakes);
    })();
  }, [selectedType]);

  React.useEffect(() => {
    (async () => {
      const makeIds = selectedMakes.map((make) => make.value);
      const carData = await fetchCarData({
        type: selectedType,
        year,
        makeIds,
      });
      setCarData(carData);
    })();
  }, [selectedMakes]);

  return (
    <>
      <VStack align="start" spacing={5}>
        <h1>Car Search</h1>
        <Text mb="8px">Select Car Type:</Text>
        <Container maxW="container.sm" color="#262626">
          <Select
            placeholder="Select option"
            disabled={!types.length}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {types.map((type) => (
              <option value={type}>{type}</option>
            ))}
          </Select>
          <Text mb="8px">Select Car Make(s)</Text>
          <MultiSelect
            onChange={(newSelectedMakes) => setSelectedMakes(newSelectedMakes)}
            isDisabled={!makes.length}
            isMulti
            tagVariant="solid"
            options={makes.map((make) => ({
              label: make.name,
              value: make.id,
            }))}
          />
          <Text mb="8px">Label</Text>
          <Checkbox>asdfds</Checkbox>
          <Text mb="8px">Label</Text>
          <Input />
        </Container>
      </VStack>
      <br />
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>Make ID</Th>
              <Th>Make Name</Th>
              <Th>Model ID</Th>
              <Th>Model Name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {carData.map((car) => (
              <Tr>
                <Td>{car.makeId}</Td>
                <Td>{car.makeName}</Td>
                <Td>{car.modelId}</Td>
                <Td>{car.modelName}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Make ID</Th>
              <Th>Make Name</Th>
              <Th>Model ID</Th>
              <Th>Model Name</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
}

export default App;
