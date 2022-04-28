import * as React from "react";
import {
  Button,
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
  Spinner,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Select as MultiSelect } from "chakra-react-select";

import { fetchTypes, fetchMakes, fetchCarData } from "./fetch";

function App() {
  const [types, setTypes] = React.useState([]);
  const [selectedType, setSelectedType] = React.useState(null);

  const [makes, setMakes] = React.useState([]);
  const [selectedMakes, setSelectedMakes] = React.useState([]);

  const [carData, setCarData] = React.useState([]);

  const [isYear, setIsYear] = React.useState(false);
  const [year, setYear] = React.useState("");
  const [isYearError, setIsYearError] = React.useState(false);

  const [lastSubmission, setLastSubmission] = React.useState(null);

  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      const newTypes = await fetchTypes();
      setTypes(newTypes);
      setIsLoading(false);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      const newMakes = await fetchMakes(selectedType);
      setMakes(newMakes);
      setIsLoading(false);
    })();
  }, [selectedType]);

  const searchCarData = async () => {
    setIsLoading(true);
    const makeIds = selectedMakes.map((make) => make.value);
    const carData = await fetchCarData({
      type: selectedType,
      year,
      makeIds,
    });
    setLastSubmission({ selectedMakes, type: selectedType, year, isYear });
    setCarData(carData);
    setIsLoading(false);
  };

  React.useEffect(() => {
    console.log(isYear);
  }, [isYear]);

  const validateYear = () => {
    if (Number.isNaN(parseInt(year))) return false;
    if (year.length !== 4) return false;
    return true;
  };

  const currentSubmissionEqualsLastSubmission = () => {
    if (!lastSubmission) return false;
    if (lastSubmission.isYear !== isYear) return false;
    if (isYear && lastSubmission.year !== year) return false;
    if (lastSubmission.type !== selectedType) return false;
    if (lastSubmission.selectedMakes.length !== selectedMakes.length)
      return false;
    for (let i = 0; i < selectedMakes.length; i++) {
      if (lastSubmission.selectedMakes[i] !== selectedMakes[i]) return false;
    }
    return true;
  };

  React.useEffect(() => {
    setButtonDisabled(
      isLoading ||
        selectedType == null ||
        !selectedMakes.length ||
        (isYear && !validateYear()) ||
        currentSubmissionEqualsLastSubmission()
    );
  }, [selectedMakes, selectedType, year, isYear]);

  React.useEffect(() => {
    if (!isYear) {
      setIsYearError(false);
      return;
    }
    if (year === "") {
      setIsYearError(false);
      return;
    }
    if (validateYear()) {
      setIsYearError(false);
      return;
    }
    setIsYearError(true);
  }, [isYear, year]);

  return (
    <>
      <VStack align="start" spacing={5}>
        <Container maxW="container.sm" color="#262626">
          <br />
          <br />
          <br />
          <br />
          <h1>Car Search</h1>
          <br />
          <Text mb="8px">Select Car Type:</Text>
          <Select
            placeholder="Select option"
            disabled={!types.length}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {types.map((type) => (
              <option value={type}>{type}</option>
            ))}
          </Select>
          <br />

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
          <br />

          <Checkbox
            value={isYear}
            onChange={(e) => setIsYear(e.target.checked)}
          >
            Use Year?
          </Checkbox>
          {isYear ? (
            <>
              <Input
                isInvalid={isYearError}
                placeholder="2015"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />

              {isYearError ? (
                <Text color="red">Please fill in a valid year.</Text>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          <br />
          <br />

          <Button
            disabled={buttonDisabled}
            onClick={() => searchCarData()}
            colorScheme="teal"
          >
            Search
          </Button>
          {isLoading ? <Spinner /> : <></>}
        </Container>
      </VStack>
      <br />
      {carData.length ? (
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Car data</TableCaption>
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
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
