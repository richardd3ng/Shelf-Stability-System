import { assayTypeIdToName, getAssayTypeUnits, getCorrespondingAssayType } from "@/lib/controllers/assayTypeController";
import { ExperimentInfo } from "@/lib/controllers/types";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Stack } from "@mui/material";
import { GraphForOneAssayType } from "./graphForOneAssayType";
import { AssayTypeInfo } from "@/lib/controllers/types";

export type ValAndLabel  = {
    val : number;
    label : number;

};

export type DataForOneLine = {
    values : ValAndLabel[];
};

export type DataForOneAssayType = {
    conditionsToValues : Map<string, DataForOneLine>;
};

export type DataByAssayType = {
    assayTypeToData : Map<AssayTypeInfo, DataForOneAssayType>;
};



const getDataByAssayType = (experimentInfo : ExperimentInfo) : DataByAssayType => {
    const map : Map<AssayTypeInfo, DataForOneAssayType> = new Map();
    
    experimentInfo.assayResults.forEach((result) => {
        
        let correspondingAssay = experimentInfo.assays.find((assay) => assay.id === result.assayId);
        if (correspondingAssay){
            let type = getCorrespondingAssayType(correspondingAssay.assayTypeId, experimentInfo.assayTypes);
            if (!type){
                return;
            }

            let condition = experimentInfo.conditions.find((c) => c.id === correspondingAssay?.conditionId);

            if (condition) {
                if (!map.has(type)){
                    map.set(type, {
                        conditionsToValues : new Map()
                    });
                }
                if (!map.get(type)?.conditionsToValues.has(condition.name)){
                    map.get(type)?.conditionsToValues.set(condition.name, {
                        values : []
                    });
                }
                if (result.result){
                    map.get(type)?.conditionsToValues.get(condition.name)?.values.push({
                        val : result.result,
                        label : correspondingAssay.week
                    });
                }
                
            }
        }
    })
    return {
        assayTypeToData : map
    };

}

export function BasicScatter() {
    const experimentId = useExperimentId();
    const {data} = useExperimentInfo(experimentId);
    if (data){
        const dataByAssayType = getDataByAssayType(data);
        return (
            <Stack gap={4}>
                {Array.from(dataByAssayType.assayTypeToData.entries()).map(([key , value]) => {
                    return <GraphForOneAssayType data={value} key={key.id} type={key.assayType.name} units={key.assayType.units ? key.assayType.units : ""}/>
                })}
            </Stack>
        );
    }
    return null;
  }