import EmployeeContainer from "@/components/employee/employeeContainer";

export default async function EmployeeIdPage({ params }) {
  const { id } = params;

  return (
    <EmployeeContainer id={id} />
  );
}
