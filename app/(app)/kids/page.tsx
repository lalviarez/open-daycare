import { children } from "@/lib/mock-data";
import KidsScreen from "@/components/KidsScreen";

export default function KidsPage() {
  return <KidsScreen mockKids={children} />;
}