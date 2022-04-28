export const fetchTypes = async () => {
  const raw = await fetch(
    "https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablevalueslist/vehicle%20type?format=json"
  );
  const data = await raw.json();
  const types = data.Results.map((obj) => obj.Name);
  return types;
};

export const fetchMakes = async (type) => {
  if (type == null) return [];
  type = type.trim();
  const raw = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${type}?format=json`
  );
  const data = await raw.json();
  const makes = data.Results.map((obj) => ({
    id: obj.MakeId,
    name: obj.MakeName,
  }));
  return makes;
};

export const fetchCarData = async ({ type, makeIds, year }) => {
  type = type.trim();
  const data = [];
  if (year == null) {
    for (const makeId of makeIds) {
      const raw = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/vehicleType/${type}?format=json`
      );
      const newData = await raw.json();
      data.push(...newData.Results);
    }
  } else {
    for (const makeId of makeIds) {
      const raw = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}/vehicleType/${type}?format=json`
      );
      const newData = await raw.json();
      data.push(...newData.Results);
    }
  }
  const carData = data.map((obj) => ({
    makeId: obj.Make_ID,
    makeName: obj.Make_Name,
    modelId: obj.Model_ID,
    modelName: obj.Model_Name,
  }));
  return carData;
};
