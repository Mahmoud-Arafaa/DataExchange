using ApiProject.Data;
using ApiProject.Dtos;
using ApiProject.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : Controller
    {
        private readonly EmployeeDbContext _employeeDbContext;
        private readonly IMapper _mapper;

        public EmployeesController(EmployeeDbContext employeeDbContext,
                                   IMapper mapper
                                  )
        {
            this._employeeDbContext = employeeDbContext;
            _mapper = mapper;

        }

        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var AllEmps = await _employeeDbContext.Employees.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<GetAllEmployeesDto>>(AllEmps));

        }


        [HttpPost]
        public async Task<IActionResult> AddEmployee(AddEmployeeDto dto)
        {
            var model = _mapper.Map<Employee>(dto);
            model.Id = Guid.NewGuid();
            await _employeeDbContext.AddAsync(model);
            await _employeeDbContext.SaveChangesAsync();
            return Ok(_mapper.Map<GetAllEmployeesDto>(model));
        }

        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetEmployeeById([FromRoute] Guid id)
        {
            var model = await _employeeDbContext.Employees.FindAsync(id);
            if (model is null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<GetAllEmployeesDto>(model));

        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateEmployeeById([FromRoute] Guid id, UpdateEmployeeDto dto)
        {
            var model = await _employeeDbContext.Employees.FindAsync(id);
            if (model is null)
            {
                return NotFound();
            }
            _mapper.Map(dto, model);
            _employeeDbContext.Entry(model);
            await _employeeDbContext.SaveChangesAsync();
            return Ok(_mapper.Map<GetAllEmployeesDto>(model));
        }
        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteEmployeeById([FromRoute] Guid id)
        {
            var employee = await _employeeDbContext.Employees.FindAsync(id);
            if (employee is null)
            {
                return NotFound();
            }
            _employeeDbContext.Employees.Remove(employee);
            await _employeeDbContext.SaveChangesAsync();
            return Ok();

        }
        [HttpGet("{email}")]
        public async Task<IActionResult> GetEmployeeByEmail([FromRoute] string email)
        {
            var model = await _employeeDbContext.Employees.FirstOrDefaultAsync(e => e.Email == email);
            return Ok(_mapper.Map<GetAllEmployeesDto>(model));
        }
        
    }
}
