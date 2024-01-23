import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import NavBar from "./components/nav-bar";
import Stack from "@mui/joy/Stack";
import ExperimentList from "./ExperimentList/experiment-list";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Stack spacing={2}>
      <NavBar />
      <ExperimentList />
    </Stack>
  );
}
