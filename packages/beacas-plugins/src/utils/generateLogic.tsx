import { Tag } from "@arco-design/web-react";
import {
  ConditionOperator,
  ConditionOperatorSymbol,
  LogicCondition,
} from "beacas-core";
import React from "react";

export const generateLogic = (option: LogicCondition) => {
  if (!option) return null;

  const { symbol, groups } = option;
  const generateExpression = (
    condition: {
      left: string | number;
      operator: ConditionOperator;
      right: string | number;
    },
    symbol: ConditionOperatorSymbol,
    index: number
  ) => {
    if (condition.operator === ConditionOperator.TRUTHY) {
      return condition.left;
    }
    if (condition.operator === ConditionOperator.FALSY) {
      return condition.left + " == nil" || condition.left + " == false";
    }
    return (
      <React.Fragment key={index}>
        {index !== 0 && <span>&nbsp;{symbol.toLocaleUpperCase()}&nbsp;</span>}
        <Tag color="arcoblue">
          {condition.left + " " + condition.operator + " " + condition.right}
        </Tag>
      </React.Fragment>
    );
  };

  return (
    <>
      {groups.map((item, index) => {
        return (
          <React.Fragment key={index}>
            {item.groups.map((child, index) =>
              generateExpression(child, item.symbol, index)
            )}
            {index !== groups.length - 1 && (
              <div>{symbol.toLocaleUpperCase()}</div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
