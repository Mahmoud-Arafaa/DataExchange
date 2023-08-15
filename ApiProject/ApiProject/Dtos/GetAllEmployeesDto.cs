namespace ApiProject.Dtos
{
    public class GetAllEmployeesDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public decimal Salary { get; set; }
        public string Department { get; set; }
    }
}
