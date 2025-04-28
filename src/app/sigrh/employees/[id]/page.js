import EmployeeContainer from "@/components/employee/employeeContainer";

export default function EmployeeIdPage({ params }) {
  const { id } = params;

  return (
    <EmployeeContainer id={id} />
  );
}
