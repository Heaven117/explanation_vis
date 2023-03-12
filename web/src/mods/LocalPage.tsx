import React, { useState } from "react";
import _ from "lodash";
import InstancePart from "../components/Instance";
import { useReducerContext } from "@/service/store";
import { Button } from "antd";
import InfluenceDrawer from "../components/InfluenceDrawer";
function LocalPage() {
  const {
    state: { currentId, compareItem },
    // dispatch,
  } = useReducerContext();
  const [openInfluencePart, setOpenInfluencePart] = useState(false);

  const showDrawer = () => {
    setOpenInfluencePart(true);
  };

  return (
    <>
      <div className="charts">
        {!_.isNil(currentId) && (
          <InstancePart showId={currentId} elementId="currentChart" />
        )}
        {!_.isNil(compareItem) && (
          <InstancePart
            showId={compareItem.id}
            elementId="compareChart"
            influenceValue={compareItem.value}
          />
        )}
      </div>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      {/* 影响示例抽屉 */}
      {openInfluencePart && (
        <InfluenceDrawer
          open={openInfluencePart}
          setOpen={setOpenInfluencePart}
        />
      )}
    </>
  );
}

export default LocalPage;
