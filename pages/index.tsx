import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <div>
            Hi
        </div>
    )
}

export async function getServerSideProps(){
    return {
        redirect : {
            destination: '/experiment-list',
            permanent: false,
        },
    }
    
}