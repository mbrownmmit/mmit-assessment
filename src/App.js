import { ChakraProvider } from "@chakra-ui/react";
import Form from "./Form";

function App() {
  return (
    <ChakraProvider>
      <Form />
    </ChakraProvider>
  );
}

export default App;
