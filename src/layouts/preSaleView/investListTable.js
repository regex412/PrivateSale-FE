/* eslint-disable react/button-has-type */
import { Table, Spin } from "antd";

// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line no-unused-vars
import { Excel } from "antd-table-saveas-excel";
import MDButton from "components/MDButton";

const columns = [
  {
    title: "Invester",
    dataIndex: "invester",
    width: "10%",
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
  },
  {
    title: "(Token)",
    dataIndex: "tokenAmount",
    width: "10%",
  },
  {
    title: "(BNB/BUSD)",
    dataIndex: "priceAmount",
    width: "10%",
  },
];
// eslint-disable-next-line react/prop-types
function InvestListTable({ data, getInvestLoadingState }) {
  const downLoadTableData = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(columns)
      .addDataSource(data, {
        str2Percent: true,
      })
      .saveAs("InvestList.xlsx");
  };
  return (
    <div style={{ width: "100%" }}>
      {getInvestLoadingState ? (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Spin />
        </div>
      ) : (
        <>
          <Table
            pageSize={5}
            columns={columns}
            dataSource={data}
            scroll={{
              x: 370,
            }}
          />
          <MDButton onClick={downLoadTableData} color="info">
            export
          </MDButton>
        </>
      )}
    </div>
  );
}
export default InvestListTable;
