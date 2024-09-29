using Microsoft.EntityFrameworkCore;
using SignalRDemo.Models;

namespace SignalRDemo.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public virtual DbSet<Connection> Connections { get; set; }
    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Connection>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("connections");

            entity.HasIndex(e => e.UserId, "userId");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SignalrId)
                .HasMaxLength(22)
                .HasColumnName("signalrId");
            entity.Property(e => e.TimeStamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("timeStamp");
            entity.Property(e => e.UserId).HasColumnName("userId");

            entity.HasOne(d => d.User).WithMany(p => p.Connections)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.BeerGameAmount)
                .HasColumnType("mediumint")
                .HasColumnName("beerGameAmount");
            entity.Property(e => e.BeerWinAmount).HasColumnName("beerWinAmount");

            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .HasColumnName("email");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(60)
                .HasColumnName("passwordHash");

            entity.Property(e => e.RockPaperScissorsGameAmount).HasColumnName("rockPaperScissorsGameAmount");
            entity.Property(e => e.RockPaperScissorsDrawAmount)
                .HasColumnType("mediumint")
                .HasColumnName("rockPaperScissorsDrawAmount");
            entity.Property(e => e.RockPaperScissorsWinAmount)
                .HasColumnType("mediumint")
                .HasColumnName("rockPaperScissorsWinAmount");
            entity.Property(e => e.Role).HasColumnName("role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
