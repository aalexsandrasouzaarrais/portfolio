var builder = WebApplication.CreateBuilder(args);

// 1. Adiciona o suporte para os Controllers que criamos na pasta Controllers
builder.Services.AddControllers();

// 2. Configura o CORS para permitir que o Next.js (geralmente na porta 3000) acesse esta API
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // URL padrão do Next.js
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 3. Ativa a configuração de CORS que definimos acima
app.UseCors("PermitirNextJs");

app.UseHttpsRedirection();

app.UseAuthorization();

// 4. Mapeia automaticamente as rotas dos nossos Controllers (ex: api/investment/...)
app.MapControllers();

app.Run();