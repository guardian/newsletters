export const getNewsletters = async () => {
  const data = await fetch("http://localhost:3000/api/newsletters", {
    "method": "GET",
    "headers": {}
  })

  return data.json()
}