// Fixtures de mesas para a demonstração. Substituir por consulta ao servidor em produção.
export const demoTables = [
  {
    uid: "e12f27be-d7f1-4b99-9386-605f3c71244a",
    number: "01",
  },
  {
    uid: "f54400d7-c6f2-4bff-9dfc-464ffe8acbf8",
    number: "02",
  },
  {
    uid: "1d1a0204-51a5-4391-a6be-2654916928f1",
    number: "03",
  },
  {
    uid: "9d6aa133-6906-4650-a715-1a20ce49c6d4",
    number: "04",
  },
  {
    uid: "6ec5a47b-6cfd-4cd8-b821-c7f67c8a5bbc",
    number: "05",
  },
  {
    uid: "cc5ca111-a76f-461e-8cb9-bcbcc470b1db",
    number: "06",
  },
  {
    uid: "8bb7b60f-d8d1-4079-8f70-b1ebf8ea7efa",
    number: "07",
  },
  {
    uid: "3fc83f69-3cf7-44f5-b1ea-976246aa0c89",
    number: "08",
  },
  {
    uid: "439aaf1b-8782-4a63-95f4-59a1d6d722a0",
    number: "09",
  },
  {
    uid: "79fc892c-f1bf-49a6-9cb9-94a8219fdf3b",
    number: "10",
  },
  {
    uid: "4b4aaf88-68fc-4c93-9ece-eff05ca2d478",
    number: "11",
  },
  {
    uid: "39954aaa-fcc0-498e-b1a7-6e0be017fb1f",
    number: "12",
  },
];
export const resolveTable = (uid) =>
  demoTables.find((table) => table.uid === uid) || null;
