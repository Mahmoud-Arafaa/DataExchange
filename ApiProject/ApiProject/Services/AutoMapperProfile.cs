using ApiProject.Dtos;
using ApiProject.Models;
using AutoMapper;

namespace ApiProject.Services
{
    public class AutoMapperProfile : Profile
    {
        //Source -> Target
        public AutoMapperProfile()
        {
            CreateMap<Employee, GetAllEmployeesDto>();
         
            CreateMap<Employee,AddEmployeeDto >();

            CreateMap<AddEmployeeDto, Employee>();

            CreateMap<Employee, GetAllEmployeesDto>();

            CreateMap<UpdateEmployeeDto, Employee>();
        }
    }
}
