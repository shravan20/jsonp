// Presets for different tabs
window.PRESETS = {
  formatter: {
    "Sample JSON": {
      name: "Sample JSON",
      content: JSON.stringify(
        {
          name: "Eliezer Nsengi",
          age: 30,
          address: {
            street: "Kigali, KK47",
            city: "Kigali",
            country: "RWANDA",
          },
          hobbies: ["reading", "gaming", "coding"],
          isActive: true,
        },
        null,
        2
      ),
    },
    "Empty Object": {
      name: "Empty Object",
      content: "{}",
    },
    "Array Example": {
      name: "Array Example",
      content: JSON.stringify(
        [
          { id: 1, name: "Item 1" },
          { id: 2, name: "Item 2" },
          { id: 3, name: "Item 3" },
        ],
        null,
        2
      ),
    },
  },
  compare: {
    "Simple Diff": {
      name: "Simple Diff",
      leftContent: JSON.stringify({ a: 1, b: 2 }, null, 2),
      rightContent: JSON.stringify({ a: 1, b: 3 }, null, 2),
    },
    "Nested Diff": {
      name: "Nested Diff",
      leftContent: JSON.stringify(
        {
          user: { name: "John", age: 30 },
        },
        null,
        2
      ),
      rightContent: JSON.stringify(
        {
          user: { name: "Jane", age: 25 },
        },
        null,
        2
      ),
    },
  },
  codegen: {
    "User Interface": {
      name: "User Interface",
      input: JSON.stringify(
        {
          name: "string",
          age: "number",
          email: "string",
          isActive: "boolean",
        },
        null,
        2
      ),
      lang: "typescript",
    },
    "Product Schema": {
      name: "Product Schema",
      input: JSON.stringify(
        {
          id: "number",
          title: "string",
          price: "number",
          inStock: "boolean",
          categories: ["string"],
        },
        null,
        2
      ),
      lang: "typescript",
    },
  },
  mockgen: {
    User: {
      name: "User",
      schema: {
        id: "{{datatype.uuid}}",
        name: "{{name.fullName}}",
        email: "{{internet.email}}",
        age: "{{datatype.number({'min': 18, 'max': 65})}}",
        address: {
          street: "{{address.streetAddress}}",
          city: "{{address.city}}",
          country: "{{address.country}}",
        },
        isActive: "{{datatype.boolean}}",
      },
    },
    Product: {
      name: "Product",
      schema: {
        id: "{{datatype.uuid}}",
        name: "{{commerce.productName}}",
        price: "{{commerce.price}}",
        description: "{{commerce.productDescription}}",
        inStock: "{{datatype.boolean}}",
        categories: "{{commerce.department}}",
      },
    },
  },
};
