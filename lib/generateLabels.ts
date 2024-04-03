import { PDFDocument, PDFFont, PDFForm, PDFName, PDFPage, PDFTextField, StandardFonts } from "pdf-lib";
import fs from "fs";
import { AssayAgendaInfo } from "./controllers/types";
import { LocalDate } from "@js-joda/core";
import QRCode from 'qrcode';

const FONT_SIZE = 8;
const FONT = StandardFonts.Helvetica;

var test = []

for (var i = 0; i < 31; i++) {
    test.push({
        title: "Test Title",
        condition: "Test Condition",
        targetDate: LocalDate.now(),
        week: 1,
        type: "Test Type",
        id: 1,
        sampleId: 1,
        experimentId: 1,
        owner: "test",
        ownerDisplayName: "Test User",
        technician: null,
        technicianDisplayName: null,
        technicianTypes: null,
        resultId: null
    });
}

generateLabelPdf(test);

export async function generateLabelPdf(data: AssayAgendaInfo[]) {
    const templateBytes = fs.readFileSync("data/labelTemplate.pdf");
    const resultDoc = await PDFDocument.create();

    for (var i = 0; i < data.length; i += 30) {
        await fillPage(resultDoc, templateBytes, i, data);
    }

    fs.writeFileSync("data/testLabel.pdf", await resultDoc.save());
}

async function fillPage(resultDoc: PDFDocument, templateBytes: Buffer, start: number, data: AssayAgendaInfo[]) {
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

async function fillLabel(form: PDFForm, font: PDFFont, row: number, column: number, data: AssayAgendaInfo) {
    fillTextField(form.getTextField(`Name.${row}.${column}`), font, data.title);
    fillTextField(form.getTextField(`Condition.${row}.${column}`), font, data.condition);
    fillTextField(form.getTextField(`Date.${row}.${column}`), font, `${data.targetDate.toString()} (Week ${data.week})`);
    fillTextField(form.getTextField(`Type.${row}.${column}`), font, data.type);
    fillTextField(form.getTextField(`Number.${row}.${column}`), font, `${data.id}-${data.sampleId.toString().padStart(3, "0")}`);
    const png = await form.doc.embedPng(await QRCode.toDataURL(`https://shelf-stability-system.colab.duke.edu/experiments/${data.experimentId}/result/${data.sampleId}`));
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