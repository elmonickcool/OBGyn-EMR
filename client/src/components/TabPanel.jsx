function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ paddingTop: 16, width: "100%" }}>
      {value === index && children}
    </div>
  );
}

export default TabPanel;