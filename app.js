async function loadData() {
  try {
    const res = await fetch("data.json");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error("Fetch gagal:", err);
  }
}
loadData();