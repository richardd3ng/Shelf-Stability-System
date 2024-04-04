import { PDFDocument, PDFFont, PDFForm, PDFName, PDFPage, PDFTextField, StandardFonts } from "pdf-lib";
import fs from "fs";
import { LocalDate } from "@js-joda/core";
import QRCode from 'qrcode';

const FONT_SIZE = 8;
const FONT = StandardFonts.Helvetica;

interface LabelData {
    title: string;
    condition: string;
    targetDate: LocalDate;
    week: number;
    type: string;
    id: number;
    sample: number;
    experimentId: number;
}

async function testPdf() {
    var test = []

    for (var i = 0; i < 31; i++) {
        test.push({
            title: "Test Title",
            condition: "Test Condition",
            targetDate: LocalDate.now(),
            week: 1,
            type: "Test Type",
            id: 1,
            sample: 1,
            experimentId: 1,
        });
    }

    fs.writeFileSync("data/testLabel.pdf", await (await generateLabelPdf(test)).save());
}

export async function generateLabelPdf(data: LabelData[]): Promise<PDFDocument> {
    const templateBytes = fs.readFileSync("data/labelTemplate.pdf");
    const resultDoc = await PDFDocument.create();

    for (var i = 0; i < data.length; i += 30) {
        await fillPage(resultDoc, templateBytes, i, data);
    }

    return resultDoc;
}

async function fillPage(resultDoc: PDFDocument, templateBytes: Buffer, start: number, data: LabelData[]) {
    // I'm sure there's a more efficient way than reloading the template for every page, but I'm too lazy to figure it out
    const templateDoc = await PDFDocument.load(templateBytes);
    const font = await templateDoc.embedFont(FONT);
    const form = templateDoc.getForm();

    for (var row = 0; row < 10; row++) {
        for (var column = 0; column < 3; column++) {
            var idx = start + row * 3 + column;
            if (idx >= data.length) {
                break;
            }
            await fillLabel(form, font, row, column, data[idx]);
        }
    }

    form.flatten();

    var [page] = await resultDoc.copyPages(templateDoc, [0]);
    resultDoc.addPage(page);
}

async function fillLabel(form: PDFForm, font: PDFFont, row: number, column: number, data: LabelData) {
    fillTextField(form.getTextField(`Name.${row}.${column}`), font, data.title);
    fillTextField(form.getTextField(`Condition.${row}.${column}`), font, data.condition);
    fillTextField(form.getTextField(`Date.${row}.${column}`), font, `${data.targetDate.toString()} (Week ${data.week})`);
    fillTextField(form.getTextField(`Type.${row}.${column}`), font, data.type);
    fillTextField(form.getTextField(`Number.${row}.${column}`), font, `${data.experimentId}-${data.sample.toString().padStart(3, "0")}`);
    const png = await form.doc.embedPng(await QRCode.toDataURL(
        `https://shelf-stability-system.colab.duke.edu/experiments/${data.experimentId}/result/${data.sample}`
    ));
    form.getButton(`QR.${row}.${column}`).setImage(png);
}

// Adds ellipsis to the end of a string if it exceeds the field width
function fillTextField(field: PDFTextField, font: PDFFont, value: string) {
    const widgets = field.acroField.getWidgets();

    var smallestWidth = Infinity;
    widgets.forEach((w) => {
        const rect = w.getRectangle();
        if (rect.width < smallestWidth) {
            smallestWidth = rect.width;
        }
    });

    var sliced = false;
    while (font.widthOfTextAtSize(value + (sliced ? "…" : ""), FONT_SIZE) > smallestWidth) {
        sliced = true;
        value = value.slice(0, -1);
    }

    if (sliced) {
        value += "…";
    }

    field.setText(value);
}