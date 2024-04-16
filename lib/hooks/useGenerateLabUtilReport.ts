import { useMutation } from "@tanstack/react-query";
import { useAlert } from "../context/shared/alertContext";
import { useLoading } from "../context/shared/loadingContext";
import { fetchUtilizationData } from "../controllers/assayController";
import { getErrorMessage } from "../api/apiHelpers";
import { UtilizationReportParams } from "../controllers/types";
import { generateExcelUtilizationReport } from "../generateExcelUtilizationReport";

const fetchUtilizationDataAndGenerateExcelReport = async (params : UtilizationReportParams) => {
    const rows = await fetchUtilizationData(params);
    generateExcelUtilizationReport(rows, params.startDate, params.endDate);
    return rows;
}
export const useGenerateLabUtilReport = () => {
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: fetchUtilizationDataAndGenerateExcelReport,
        onSuccess: () => {
            showAlert(
                "success",
                `Succesfully generated the report! Check your downloads`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: () => {
            showLoading("Generating report...");
        },
        onSettled: () => {
            hideLoading();
        },
    });
};