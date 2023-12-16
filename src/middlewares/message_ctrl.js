
module.exports.addMessage = (req, res) => {
  const { email, topic, message } = req.body;
  const data = JSON.stringify({email, topic, message});
  // nu uita in firbase trebuie sa pui json la final
  fetch("https://german-max-app-default-rtdb.europe-west1.firebasedatabase.app/messages.json",{
    method:"POST",
    headers:{
      "Content-Type": "application/json"
    },
    body:data
  }).then(res => {
    if(!res.ok) {
        throw Error('Could not fetch data for that resource, Captain.')
    }
    return res.json();})
  .then(() => {
    res.json({ status: "sent" });
  })
  .catch((err) => {
    console.error(err);
    res.json({ status: "error" });
  });
}
